import React from 'react';
// import { IoMdDownload } from 'react-icons/io';
import { Document, Font, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';

Font.register({
    family: "TiroBangla-Regular",
    src: "/fonts/TiroBangla-Regular.ttf",
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        lineHeight: 1.6,
    },
    title: {
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 20,
    },
    section: {
        marginBottom: 14,
    },
    number: {
        fontWeight: "bold",
        fontSize: 12,
    },
    bengali: {
        fontFamily: "TiroBangla-Regular",
        fontSize: 12,
        marginBottom: 3,
    },
    english: {
        fontSize: 10,
        fontStyle: "italic",
        color: "#333",
    },
    feeBox: {
        border: "1pt solid black",
        padding: 8,
        marginVertical: 8,
        borderRadius: 4,
    },
    feeHeading: {
        fontFamily: "TiroBangla-Regular",
        fontSize: 12,
        marginBottom: 6,
    },
});

const MemberShipPolicyPDF = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Membership Policy</Text>

            {/* Point 1 */}
            <View style={styles.section}>
                <Text style={styles.number}>1.</Text>
                <Text style={styles.bengali}>
                    রেওয়াজের সকল শিক্ষার্থীদের অভিভাবকবৃন্দ, সহশিল্পী, সংগীতপ্রেমী এবং অত্র প্রতিষ্ঠানের লক্ষ্য ও সাংস্কৃতিক বিকাশে আগ্রহী সকল শুভানুধ্যায়ীরা সদস্যপদের জন্যে আবেদন করতে পারবেন।
                </Text>
                <Text style={styles.english}>
                    (Guardians of Rewaz students, fellow artists, music enthusiasts, and well-wishers interested in promoting our mission and cultural development are eligible to become members)
                </Text>
            </View>

            {/* Point 2 */}
            <View style={styles.section}>
                <Text style={styles.number}>2.</Text>
                <Text style={styles.bengali}>
                    সদস্যপদের জন্যে আবেদন করার পরে প্রতিষ্ঠানের অ্যাডমিন প্যানেল কর্তৃক সদস্যপদ কার্ড ইস্যু হতে কিংবা সদস্যপদ অ্যাপ্রুভ হতে ২৪-৪৮ ঘণ্টা সময় লাগতে পারে। উক্ত সময়কাল যাবৎ ধৈর্য্য সহকারে সকলকে অপেক্ষা করার জন্য অনুরোধ করা হচ্ছে।
                </Text>
                <Text style={styles.english}>
                    (After applying for membership, it may take 24–48 hours for the membership card to be issued or for the membership to be approved by the organization’s admin panel. During this period, everyone is kindly requested to wait patiently)
                </Text>
            </View>

            {/* Point 3 */}
            <View style={styles.section}>
                <Text style={styles.number}>3.</Text>
                <Text style={styles.bengali}>
                    সকল সদস্যবৃন্দ তাদের সদস্য কার্ডের সফট কপি ওয়েবসাইটের মেম্বারশিপ অংশে পেয়ে যাবেন এবং চাইলে পিডিএফ আকারে নিজেরা ডাউনলোড করে সংরক্ষণ করতে পারবেন। সদস্য কার্ডধারী সকলকে রেওয়াজ কর্তৃক আয়োজিত যেকোনো মাসিক, ত্রিমাসিক, ষান্মাসিক কিংবা বার্ষিক অনুষ্ঠানে বিনামূল্যে প্রবেশের সুবিধা দেওয়া হবে।
                </Text>
                <Text style={styles.english}>
                    (All members will be able to access the soft copy of their membership card in the membership section of the website and can download and save it as a PDF if they wish. All cardholders will enjoy free entry to any monthly, quarterly, half-yearly, or annual events organized by Rewaz)
                </Text>
            </View>

            {/* Point 4 */}
            <View style={styles.section}>
                <Text style={styles.number}>4.</Text>
                <Text style={styles.bengali}>
                    প্রতিটি সদস্যপদের মেয়াদ ৬ মাস। প্রতি ৬ মাস অন্তর প্রত্যেক সদস্যকে তাদের সদস্যপদ নবায়ন করতে হবে। অন্যথায় সদস্যপদ বাতিল বলে গণ্য হবে।
                </Text>
                <Text style={styles.english}>
                    (Each membership is valid for 6 months. Every member must renew their membership at the end of each 6-month period; otherwise, the membership will be considered canceled)
                </Text>
            </View>

            {/* Point 5 */}
            <View style={styles.section}>
                <Text style={styles.number}>5.</Text>
                <View style={styles.feeBox}>
                    <Text style={styles.feeHeading}>সদস্য ফি (এককালীন) : ৫০০ টাকা (ফেরতযোগ্য নয়)</Text>
                    <Text style={styles.feeHeading}>নবায়ন ফি (ষান্মাসিক) : ১০০ টাকা</Text>
                    <Text style={styles.english}>[Membership Fee (one-time) : 500 BDT (Non-Refundable)</Text>
                    <Text style={styles.english}>Renewal Fee (Half-Yearly) : 100 BDT]</Text>
                </View>
            </View>

            {/* Point 6 */}
            <View style={styles.section}>
                <Text style={styles.number}>6.</Text>
                <Text style={styles.bengali}>
                    প্রত্যেক সদস্যকে অত্র প্রতিষ্ঠানের নিয়মনীতি ও মূল্যবোধ মেনে চলতে হবে। শালীনতা বজায় রেখে প্রতিষ্ঠানের সকল আনুষ্ঠানিকতা কিংবা আয়োজনে সক্রিয়ভাবে অংশগ্রহণ করতে হবে। 
                    প্রতিষ্ঠানের নীতি ও মূল্যবোধ বহির্ভূত যেকোনো কার্যকলাপে প্রত্যক্ষ কিংবা পরোক্ষভাবে জড়িত থাকার প্রমাণ পাওয়া গেলে কর্তৃপক্ষ যেকোনো সময়ে সদস্যপদ প্রত্যাহার কিংবা সাময়িকভাবে স্থগিত করতে পারে।
                </Text>
                <Text style={styles.english}>
                    (Each member must follow the rules and values of the organization. Members are expected to participate actively in all official activities or events while maintaining decorum. 
                    If a member is found to be directly or indirectly involved in any activities that go against the organization’s policies and values, the authorities may revoke or temporarily suspend the membership at any time)
                </Text>
            </View>

            {/* Point 7 */}
            <View style={styles.section}>
                <Text style={styles.number}>7.</Text>
                <Text style={styles.bengali}>
                    যেকোনো সদস্য কার্ড শুধুমাত্র ইস্যুকৃত সদস্যই ব্যবহার করতে পারবে। ইস্যুকৃত সদস্য ব্যতীত অন্য কারো কাছে এই কার্ড পাওয়া গেলে বা সদস্য কার্ড ব্যবহার করে কোনোরূপ বিশেষ সুবিধা ভোগ করার চেষ্টা করলে সেই সদস্য কার্ড সাময়িকভাবে ডি-অ্যাক্টিভেট কিংবা ক্ষেত্রবিশেষে সদস্যপদ বাতিল হতে পারে।
                </Text>
                <Text style={styles.english}>
                    (Any membership card can only be used by the member to whom it was issued. If the card is found in possession of anyone other than the issued member, or if someone tries to use the membership card to enjoy any special privileges, the card may be temporarily deactivated, and in certain cases, the membership may be canceled)
                </Text>
            </View>

            {/* Point 8 */}
            <View style={styles.section}>
                <Text style={styles.number}>8.</Text>
                <Text style={styles.bengali}>
                    যেকোনো প্রকার অসদাচরণ, সুযোগের অপব্যবহার কিংবা নীতিমালা ভঙ্গের দায়ে কর্তৃপক্ষ বিনা নোটিশে সদস্যপদ বাতিল করার ক্ষমতা রাখে।
                </Text>
                <Text style={styles.english}>
                    (The authorities reserve the right to cancel a membership without notice in case of any misconduct, misuse of privileges, or violation of policies)
                </Text>
            </View>
        </Page>
    </Document>
);

const MembershipPolicy = () => {
    return (
        <div className='my-20 mx-4 max-w-4xl lg:mx-auto'>
            <title>Membership Policy | Rewaz</title>
            <div className='shadow-md p-6 rounded-md'>
                <div className='flex justify-end mb-4'>
                    <PDFDownloadLink document={<MemberShipPolicyPDF />} fileName="Membership-policy.pdf" className='btn btn-outline btn-sm'>
                        {({ loading }) =>
                            loading ? 'Loading document...' : 'Download in PDF'
                        }
                    </PDFDownloadLink>
                </div>
                <h1 className='text-3xl font-bold my-4 text-center'>
                    Membership Policy <span className='font-bangla'>(সদস্যপদ নীতিমালা)</span>
                </h1>
                <div>
                    <ol className='list-decimal list-inside text-justify'>
                        <li className='my-8'><span className='font-bangla'>রেওয়াজের সকল শিক্ষার্থীদের অভিভাবকবৃন্দ, সহশিল্পী, সংগীতপ্রেমী এবং অত্র প্রতিষ্ঠানের লক্ষ্য ও সাংস্কৃতিক বিকাশে আগ্রহী সকল শুভানুধ্যায়ীরা সদস্যপদের জন্যে আবেদন করতে পারবেন।</span> <br /><span className='text-gray-500 italic'>(Guardians of Rewaz students, fellow artists, music enthusiasts, and well-wishers interested in promoting our mission and cultural development are eligible to become members)</span></li>

                        <li className='my-8'><span className='font-bangla'>সদস্যপদের জন্যে আবেদন করার পরে প্রতিষ্ঠানের অ্যাডমিন প্যানেল কর্তৃক সদস্যপদ কার্ড ইস্যু হতে কিংবা সদস্যপদ অ্যাপ্রুভ হতে ২৪-৪৮ ঘণ্টা সময় লাগতে পারে। উক্ত সময়কাল যাবৎ ধৈর্য্য সহকারে সকলকে অপেক্ষা করার জন্য অনুরোধ করা হচ্ছে।</span> <br /><span className='text-gray-500 italic'>(After applying for membership, it may take 24–48 hours for the membership card to be issued or for the membership to be approved by the organization’s admin panel. During this period, everyone is kindly requested to wait patiently)</span></li>

                        <li className='my-8'><span className='font-bangla'>সকল সদস্যবৃন্দ তাদের সদস্য কার্ডের সফট কপি ওয়েবসাইটের মেম্বারশিপ অংশে পেয়ে যাবেন এবং চাইলে পিডিএফ আকারে নিজেরা ডাউনলোড করে সংরক্ষণ করতে পারবেন। সদস্য কার্ডধারী সকলকে রেওয়াজ কর্তৃক আয়োজিত যেকোনো মাসিক, ত্রিমাসিক, ষান্মাসিক কিংবা বার্ষিক অনুষ্ঠানে বিনামূল্যে প্রবেশের সুবিধা দেওয়া হবে।</span> <br /><span className='text-gray-500 italic'>(All members will be able to access the soft copy of their membership card in the membership section of the website and can download and save it as a PDF if they wish. All cardholders will enjoy free entry to any monthly, quarterly, half-yearly, or annual events organized by Rewaz)</span></li>

                        <li className='my-8'><span className='font-bangla'>প্রতিটি সদস্যপদের মেয়াদ ৬ মাস। প্রতি ৬ মাস অন্তর প্রত্যেক সদস্যকে তাদের সদস্যপদ নবায়ন করতে হবে। অন্যথায় সদস্যপদ বাতিল বলে গণ্য হবে।</span> <br /><span className='text-gray-500 italic'>(Each membership is valid for 6 months. Every member must renew their membership at the end of each 6-month period; otherwise, the membership will be considered canceled)</span></li>

                        <li className='my-8'><span className='font-bangla'><span className='font-bold'>সদস্য ফি (এককালীন) : </span>৫০০ টাকা <span className='italic'>(ফেরতযোগ্য নয়)</span> <br /><span className='font-bold'>নবায়ন ফি (ষান্মাসিক) : </span>১০০ টাকা <br />-- সদস্য ফি কর্তৃপক্ষ কর্তৃক পরিবর্তনযোগ্য</span> <br /><span className='text-gray-500 italic'>[<span className='font-bold'>Membership Fee (one-time) : </span> 500 BDT (Non-Refundable) <br /> <span className='font-bold'>Renewal Fee (Half-Yearly) : </span> 100 BDT <br />-- Membership fees are subject to change by the authorities]</span></li>

                        <li className='my-8'><span className='font-bangla'>প্রত্যেক সদস্যকে অত্র প্রতিষ্ঠানের নিয়মনীতি ও মূল্যবোধ মেনে চলতে হবে। শালীনতা বজায় রেখে প্রতিষ্ঠানের সকল আনুষ্ঠানিকতা কিংবা আয়োজনে সক্রিয়ভাবে অংশগ্রহণ করতে হবে। প্রতিষ্ঠানের নীতি ও মূল্যবোধ বহির্ভূত যেকোনো কার্যকলাপে প্রত্যক্ষ কিংবা পরোক্ষভাবে জড়িত থাকার প্রমাণ পাওয়া গেলে কর্তৃপক্ষ যেকোনো সময়ে সদস্যপদ প্রত্যাহার কিংবা সাময়িকভাবে স্থগিত করতে পারে।</span> <br /><span className='text-gray-500 italic'>(Each member must follow the rules and values of the organization. Members are expected to participate actively in all official activities or events while maintaining decorum. If a member is found to be directly or indirectly involved in any activities that go against the organization’s policies and values, the authorities may revoke or temporarily suspend the membership at any time)</span></li>

                        <li className='my-8'><span className='font-bangla'>যেকোনো সদস্য কার্ড শুধুমাত্র ইস্যুকৃত সদস্যই ব্যবহার করতে পারবে। ইস্যুকৃত সদস্য ব্যতীত অন্য কারো কাছে এই কার্ড পাওয়া গেলে বা সদস্য কার্ড ব্যবহার করে কোনোরূপ বিশেষ সুবিধা ভোগ করার চেষ্টা করলে সেই সদস্য কার্ড সাময়িকভাবে ডি-অ্যাক্টিভেট কিংবা ক্ষেত্রবিশেষে সদস্যপদ বাতিল হতে পারে।</span> <br /><span className='text-gray-500 italic'>(Any membership card can only be used by the member to whom it was issued. If the card is found in possession of anyone other than the issued member, or if someone tries to use the membership card to enjoy any special privileges, the card may be temporarily deactivated, and in certain cases, the membership may be canceled)</span></li>

                        <li className='my-8'><span className='font-bangla'>যেকোনো প্রকার অসদাচরণ, সুযোগের অপব্যবহার কিংবা নীতিমালা ভঙ্গের দায়ে কর্তৃপক্ষ বিনা নোটিশে সদস্যপদ বাতিল করার ক্ষমতা রাখে।</span> <br /><span className='text-gray-500 italic'>(The authorities reserve the right to cancel a membership without notice in case of any misconduct, misuse of privileges, or violation of policies)</span></li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default MembershipPolicy;
